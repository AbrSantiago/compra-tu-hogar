import ast
from pathlib import Path

from .utils import (
    assert_no_violations,
    iter_python_files,
    parse_ast,
)

PROJECT_ROOT = Path(__file__).resolve().parents[2]
APP_ROOT = PROJECT_ROOT / "app"


def test_no_print_statements() -> None:
    """
    Application code should use logging instead of print.
    """
    violations: list[str] = []

    for file in iter_python_files():
        if file.name == "__init__.py":
            continue

        tree = parse_ast(file)

        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name) and node.func.id == "print":
                    violations.append(f"{file.relative_to(APP_ROOT)} uses print()")

    assert_no_violations(violations)


def test_no_wildcard_imports() -> None:
    """
    Wildcard imports make dependencies unclear.
    """
    violations: list[str] = []

    for file in iter_python_files():
        if file.name == "__init__.py":
            continue

        tree = parse_ast(file)

        for node in ast.walk(tree):
            if isinstance(node, ast.ImportFrom):
                for alias in node.names:
                    if alias.name == "*":
                        violations.append(f"{file.relative_to(APP_ROOT)} uses import *")

    assert_no_violations(violations)


def test_no_relative_imports() -> None:
    """
    Imports should be absolute from app.
    """
    violations: list[str] = []

    for file in iter_python_files():
        if file.name == "__init__.py":
            continue

        tree = parse_ast(file)

        for node in ast.walk(tree):
            if isinstance(node, ast.ImportFrom):
                if node.level > 0:
                    violations.append(f"{file.relative_to(APP_ROOT)} uses relative import")

    assert_no_violations(violations)


def test_no_todo_comments() -> None:
    """
    Avoid leaving unfinished code markers.
    """
    violations: list[str] = []

    for file in iter_python_files():
        if file.name == "__init__.py":
            continue

        content = file.read_text(
            encoding="utf-8",
        )

        for line_number, line in enumerate(content.splitlines(), start=1):
            if "TODO" in line or "FIXME" in line:
                violations.append(f"{file.relative_to(APP_ROOT)}:{line_number} contains TODO/FIXME")

    assert_no_violations(violations)
