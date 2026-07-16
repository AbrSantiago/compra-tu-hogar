import ast

from .utils import (
    APP_ROOT,
    assert_no_violations,
    get_calls,
    get_imports,
    iter_python_files,
    parse_ast,
)

FORBIDDEN_IMPORTS = {
    "fastapi.routing",
    "app.api",
}

FORBIDDEN_CALLS = {
    "Depends",
    "APIRouter",
}


def test_service_does_not_import_api_or_fastapi() -> None:
    """
    Services should not depend on HTTP layer.
    """

    violations: list[str] = []

    for file in iter_python_files("service"):
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


def test_service_does_not_use_fastapi_dependencies() -> None:
    """
    Services should not use FastAPI dependency injection.
    """

    violations: list[str] = []

    for file in iter_python_files("service"):
        if file.name == "__init__.py":
            continue

        tree = parse_ast(file)

        for call in get_calls(tree):
            if call in FORBIDDEN_CALLS:
                violations.append(f"{file.relative_to(APP_ROOT)} calls {call}()")

    assert_no_violations(violations)


def test_service_functions_are_not_async_endpoints() -> None:
    """
    Services should contain business logic, not HTTP endpoints.
    """

    violations: list[str] = []

    for file in iter_python_files("service"):
        if file.name == "__init__.py":
            continue

        tree = parse_ast(file)

        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                for decorator in node.decorator_list:
                    if isinstance(decorator, ast.Call):
                        if isinstance(decorator.func, ast.Attribute) and decorator.func.attr in {
                            "get",
                            "post",
                            "put",
                            "delete",
                            "patch",
                        }:
                            violations.append(
                                f"{file.relative_to(APP_ROOT)}::{node.name} looks like an endpoint"
                            )

    assert_no_violations(violations)
