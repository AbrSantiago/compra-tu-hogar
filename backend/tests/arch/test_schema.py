import ast
from pathlib import Path

from .utils import (
    assert_no_violations,
    get_imports,
    iter_python_files,
    parse_ast,
)

PROJECT_ROOT = Path(__file__).resolve().parents[2]
APP_ROOT = PROJECT_ROOT / "app"

FORBIDDEN_IMPORTS = {
    "sqlalchemy",
    "fastapi",
    "app.model",
    "app.service",
    "app.api",
}


def test_schema_does_not_import_infrastructure() -> None:
    """
    Schemas should only define data contracts.
    They should not depend on database, API, services, or models.
    """
    violations: list[str] = []

    for file in iter_python_files("schema"):
        if file.name == "__init__.py":
            continue

        tree = parse_ast(file)

        for module in get_imports(file, tree):
            if any(module.startswith(prefix) for prefix in FORBIDDEN_IMPORTS):
                violations.append(f"{file.relative_to(APP_ROOT)} imports {module}")

    assert_no_violations(violations)


def test_schema_files_only_define_pydantic_models() -> None:
    """
    Schema files should contain Pydantic models only.
    """
    violations: list[str] = []

    for file in iter_python_files("schema"):
        if file.name == "__init__.py":
            continue

        tree = parse_ast(file)

        for node in ast.walk(tree):
            if not isinstance(node, ast.ClassDef):
                continue

            inherits_pydantic = any(
                isinstance(base, ast.Name) and base.id == "BaseModel" for base in node.bases
            )

            if not inherits_pydantic and node.name[0].isupper():
                violations.append(
                    f"{file.relative_to(APP_ROOT)}::{node.name} " "is not a Pydantic model"
                )

    assert_no_violations(violations)
