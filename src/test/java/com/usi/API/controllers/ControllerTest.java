package com.usi.API.controllers;

import com.usi.BaseIntegration;
import com.usi.model.Location;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/**
 * Created by Epoes on 08/03/17.
 */
public class ControllerTest extends BaseIntegration {
    @Autowired
    private MockMvc mockMvc;


    @Test
    public void testSomething() throws Exception {
        Location loc = new Location("a", "b", "c", "d");

        this.mockMvc.perform(post("/somePath").content(this.json(loc)).contentType(this.jsonContentType))
                .andExpect(status().isOk());

        /**
         * {
         *     "someField": "ciao"
         * }
         */
        this.mockMvc.perform(post("/somePath").content(this.json(loc)).contentType(this.jsonContentType))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.someField").value("ciao"));


        this.mockMvc.perform(get("/somePath")).andExpect(status().isOk());
    }





}
