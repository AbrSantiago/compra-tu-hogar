import ast

from .utils import (
    APP_ROOT,
    assert_no_violations,
    get_imports,
    iter_python_files,
    parse_ast,
)

FORBIDDEN_IMPORTS = {
    "app.api",
    "app.service",
    "app.schema",
    "fastapi",
    "pydantic",
}


def test_models_do_not_depend_on_upper_layers() -> None:
    """
    Models should only depend on database/domain level code.
    """

    violations: list[str] = []

    for file in iter_python_files("model"):
        if file.name == "__init__.py":
            continue

        tree = parse_ast(file)

        for module in get_imports(file, tree):
            if any(
                module == forbidden or module.startswith(f"{forbidden}.")
                for forbidden in FORBIDDEN_IMPORTS
            ):
                violations.append(f"{file.relative_to(APP_ROOT)} imports {module}")

    assert_no_violations(violations)


def test_models_define_table_name() -> None:
    """
    Every SQLAlchemy model should define __tablename__.
    """

    violations: list[str] = []

    for file in iter_python_files("model"):
        if file.name == "__init__.py":
            continue

        tree = parse_ast(file)

        has_table_name = False

        for node in ast.walk(tree):
            if isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name) and target.id == "__tablename__":
                        has_table_name = True

        if not has_table_name:
            violations.append(f"{file.relative_to(APP_ROOT)} has no __tablename__")

    assert_no_violations(violations)


def test_models_do_not_define_routes() -> None:
    """
    Models should not contain API decorators.
    """

    violations: list[str] = []

    HTTP_METHODS = {
        "get",
        "post",
        "put",
        "delete",
        "patch",
    }

    for file in iter_python_files("model"):
        if file.name == "__init__.py":
            continue

        tree = parse_ast(file)

        for node in ast.walk(tree):
            if not isinstance(node, ast.FunctionDef):
                continue

            for decorator in node.decorator_list:
                if not isinstance(decorator, ast.Call):
                    continue

                if not isinstance(decorator.func, ast.Attribute):
                    continue

                if decorator.func.attr in HTTP_METHODS:
                    violations.append(
                        f"{file.relative_to(APP_ROOT)}::{node.name} " "looks like an endpoint"
                    )

    assert_no_violations(violations)
