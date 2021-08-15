package com.tco.requests;

import com.tco.requests.RequestDistance;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestRequestDistance {

    @Test
    @DisplayName("Request type is \"distance\"")
    public void testColoradoDiagonal() {
        RequestDistance distance = new RequestDistance(6371, "41", "-109", "37", "-102");
        distance.buildResponse();
        assertEquals(750/*466*/, distance.getDistance());
    }

    @Test
    @DisplayName("Request type is \"distance\"")
    public void testNYCtoATL() {
        RequestDistance distance = new RequestDistance(6371, "40.7128", "74.0060", "33.7490", "84.3880");
        distance.buildResponse();
        assertEquals(1200/*746*/, distance.getDistance());
    }

    @Test
    @DisplayName("Request type is \"distance\"")
    public void testFOCOtoSYDNEY() {
        RequestDistance distance = new RequestDistance(6371, "40.6", "-105.1", "-33.9", "151.2");
        distance.buildResponse();
        assertEquals(13434/*8347*/, distance.getDistance());
    }


}