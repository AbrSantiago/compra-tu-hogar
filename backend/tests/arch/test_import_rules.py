# from .utils import (
#     APP_ROOT,
#     assert_no_violations,
#     get_import_layer,
#     get_imports,
#     get_layer,
#     iter_python_files,
#     parse_ast,
# )

# ALLOWED_DEPENDENCIES = {
#     "api": {"service", "schema", "core"},
#     "service": {"model", "schema", "core"},
#     "schema": {"core"},
#     "model": {"core"},
#     "core": set(),
# }


# def test_layer_dependencies() -> None:
#     violations: list[str] = []

#     for file in iter_python_files():
#         if file.name == "__init__.py":
#             continue
#         layer = get_layer(file)

#         if layer is None:
#             continue

#         tree = parse_ast(file)

#         for module in get_imports(file, tree):
#             imported_layer = get_import_layer(module)

#             # External library
#             if imported_layer is None:
#                 continue

#             # Same layer imports are always allowed
#             if imported_layer == layer:
#                 continue

#             if imported_layer not in ALLOWED_DEPENDENCIES[layer]:
#                 violations.append(f"{file.relative_to(APP_ROOT)} imports {module}")

#     assert_no_violations(violations)
