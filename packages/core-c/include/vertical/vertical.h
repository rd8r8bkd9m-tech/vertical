#ifndef VERTICAL_VERTICAL_H
#define VERTICAL_VERTICAL_H

#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

#define VERTICAL_VERSION "0.1.0"

typedef int64_t v_money;

typedef enum {
    V_STATUS_OK = 0,
    V_STATUS_INVALID_INPUT = 1,
    V_STATUS_INTERNAL_ERROR = 2
} v_status;

const char* v_version(void);

#ifdef __cplusplus
}
#endif

#endif
