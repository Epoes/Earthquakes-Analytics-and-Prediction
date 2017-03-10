package com.usi.API;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by mcalzana on 08/03/2017.
 */
@RestController
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    public ResponseEntity<?> handleHello(@PathVariable String name) {
        return ResponseEntity.ok("Hello " + name);
    }
}
