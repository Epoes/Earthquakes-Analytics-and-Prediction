package com.usi;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
public class Home {
    @RequestMapping(value = "/home", method = RequestMethod.GET)
    public String showHome() {
        return "index";
    }

    @RequestMapping(value = "/3d", method = RequestMethod.GET)
    public String showProva(){
        return "3d";
    }
}
