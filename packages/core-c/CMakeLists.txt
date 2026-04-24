cmake_minimum_required(VERSION 3.20)
project(vertical_core C)

set(CMAKE_C_STANDARD 23)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

add_library(vertical_core STATIC
  src/money.c
  src/plastering.c
  src/antidop.c
  src/version.c
)

target_include_directories(vertical_core PUBLIC include)

add_executable(test_plastering tests/test_plastering.c)
target_link_libraries(test_plastering PRIVATE vertical_core m)

enable_testing()
add_test(NAME test_plastering COMMAND test_plastering)
