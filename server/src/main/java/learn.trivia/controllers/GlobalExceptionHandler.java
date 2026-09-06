package learn.trivia.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Arrays;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleMalformedRequest() {
        return new ResponseEntity<>(
                "Request body is missing or could not be read. Please check the JSON and try again.",
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleUnexpectedException(Exception ex) {
        displayErrorStackTrace(ex);
        return new ResponseEntity<>(
                "An unexpected error occurred: " + ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private void displayErrorStackTrace(Exception ex) {
        Arrays.stream(ex.getStackTrace()).forEach(System.out::println);
    }
    //TODO: IMPLEMENT

}
