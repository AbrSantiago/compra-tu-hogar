from __future__ import annotations

# import ast
from .utils import (
    APP_ROOT,
    assert_no_violations,
    get_calls,
    iter_python_files,
    parse_ast,
)

FORBIDDEN_IMPORTS = ("sqlalchemy",)

FORBIDDEN_CALLS = (
    "query",
    "create_engine",
)


def test_api_does_not_query_database() -> None:
    """
    API routes should not directly query the database.
    """
    violations: list[str] = []

    for file in iter_python_files("api"):
        if file.name == "__init__.py":
            continue

        tree = parse_ast(file)

        calls = get_calls(tree)

        for forbidden in FORBIDDEN_CALLS:
            if forbidden in calls:
                violations.append(f"{file.relative_to(APP_ROOT)} calls {forbidden}()")

    assert_no_violations(violations)


# def test_all_endpoints_define_response_model() -> None:
#     """
#     Every endpoint should define a response_model.
#     """
#     violations: list[str] = []

#     HTTP_METHODS = {
#         "get",
#         "post",
#         "put",
#         "delete",
#         "patch",
#     }

#     for file in iter_python_files("api"):
#         if file.name == "__init__.py":
#             continue

#         tree = parse_ast(file)

#         for node in ast.walk(tree):
#             if not isinstance(node, ast.FunctionDef):
#                 continue

#             for decorator in node.decorator_list:
#                 if not isinstance(decorator, ast.Call):
#                     continue

#                 if not isinstance(decorator.func, ast.Attribute):
#                     continue

#                 if decorator.func.attr not in HTTP_METHODS:
#                     continue

#                 has_response_model = any(kw.arg == "response_model" for kw in decorator.keywords)

#                 if not has_response_model:
#                     violations.append(
#                         f"{file.relative_to(APP_ROOT)}::{node.name} is missing response_model"
#                     )

#     assert_no_violations(violations)
