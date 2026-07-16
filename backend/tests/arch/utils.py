from __future__ import annotations

import ast
from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[2] / "app"

LAYER_DIRS = (
    "api",
    "core",
    "model",
    "schema",
    "service",
)


def iter_python_files(*directories: str):
    """
    Iterate over every Python file inside the given app directories.
    If no directory is provided, iterate over the whole app package.
    """
    roots = [APP_ROOT / directory for directory in directories] if directories else [APP_ROOT]

    for root in roots:
        if not root.exists():
            continue

        yield from sorted(file for file in root.rglob("*.py") if "__pycache__" not in file.parts)


def parse_ast(path: Path) -> ast.AST:
    """Parse a Python file into an AST."""
    return ast.parse(path.read_text(encoding="utf-8"))


def module_name_from_path(path: Path) -> str:
    """
    Convert a file path to its module name.

    Example:
        app/service/client.py -> app.service.client
    """
    relative = path.relative_to(APP_ROOT)
    return ".".join(("app", *relative.with_suffix("").parts))


def resolve_import(current_file: Path, node: ast.ImportFrom) -> list[str]:
    """
    Resolve an ImportFrom node into absolute module names.

    Examples:
        from app.model.client import Client
            -> ["app.model.client"]

        from .client import Client
            -> ["app.service.client"]

        from ..model.client import Client
            -> ["app.model.client"]

        from . import client
            -> ["app.service.client"]
    """
    current_package = module_name_from_path(current_file).split(".")[:-1]

    if node.level:
        package = current_package[: len(current_package) - node.level + 1]
    else:
        package = []

    if node.module:
        package.extend(node.module.split("."))
        return [".".join(package)]

    base = ".".join(package)
    return [f"{base}.{alias.name}" for alias in node.names]


def get_imports(path: Path, tree: ast.AST) -> list[str]:
    """
    Return all imported modules as absolute module names.
    """
    imports: list[str] = []

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imports.extend(alias.name for alias in node.names)

        elif isinstance(node, ast.ImportFrom):
            imports.extend(resolve_import(path, node))

    return imports


def get_calls(tree: ast.AST) -> list[str]:
    """
    Return all function/method calls.

    Example:
        print()
            -> print

        db.query()
            -> query

        Session()
            -> Session
    """
    calls: list[str] = []

    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                calls.append(node.func.id)
            elif isinstance(node.func, ast.Attribute):
                calls.append(node.func.attr)

    return calls


def get_layer(path: Path) -> str | None:
    """
    Return the application layer a file belongs to.
    Files outside a layer (e.g. app/main.py) return None.
    """
    try:
        relative = path.relative_to(APP_ROOT)
    except ValueError:
        return None

    if len(relative.parts) < 2:
        return None

    layer = relative.parts[0]
    return layer if layer in LAYER_DIRS else None


def get_import_layer(module: str) -> str | None:
    """
    Return the application layer an imported module belongs to.

    Examples:
        app.service.client -> service
        app.model.user -> model
        fastapi -> None
        sqlalchemy.orm -> None
    """
    parts = module.split(".")

    if len(parts) < 2 or parts[0] != "app":
        return None

    return parts[1] if parts[1] in LAYER_DIRS else None


def assert_no_violations(violations: list[str]) -> None:
    """
    Fail once, showing every architecture violation found.
    """
    if violations:
        message = "\n".join(f"- {violation}" for violation in sorted(violations))
        raise AssertionError(f"Architecture violations found:\n\n{message}")
