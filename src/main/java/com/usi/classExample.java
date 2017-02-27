package com.usi;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class classExample {

    @RequestMapping("/edu")
    public ResponseEntity ciaone(){
        return new ResponseEntity(HttpStatus.OK);
    }
}
