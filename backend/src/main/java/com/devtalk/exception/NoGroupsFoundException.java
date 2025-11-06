package com.devtalk.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NoGroupsFoundException extends RuntimeException {
    public NoGroupsFoundException(String message) {
        super(message);
    }
}

