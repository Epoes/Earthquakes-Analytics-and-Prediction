package com.usi.API;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HelloController {
//    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
//    public ResponseEntity<?> handleHello(@PathVariable String name) {
//        return ResponseEntity.ok("Hello " + name);
//    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView home() {
        return new ModelAndView("index");
    }
}
