package learn.trivia.TestDataHelpers;

import learn.trivia.domain.Result;
import learn.trivia.domain.ResultType;

public class Results {

    public static <T> Result<T> makeResult(String message, ResultType resultType, T payload) {
        Result<T> result = new Result<>();
        if (message != null && resultType != null) {
            result.addMessage(message, resultType);
        }
        if (payload != null) {
            result.setPayload(payload);
        }
        return result;
    }
}
