package com.tco.requests;

import com.tco.requests.RequestConfig;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestRequestConfig {

  private RequestConfig conf;

  @BeforeEach
  public void createConfigurationForTestCases(){
    conf = new RequestConfig();
    conf.buildResponse();
  }

  @Test
  @DisplayName("Request type is \"config\"")
  public void testType() {
    String type = conf.getRequestType();
    assertEquals("config", type);
  }

  @Test
  @DisplayName("Version number is equal to 3")
  public void testVersion() {
    int version = conf.getRequestVersion();
    assertEquals(4, version);
  }

  @Test
  @DisplayName("Team name is t18 progRAMmers")
  public void testServerName() {
    String name = conf.getServerName();
    assertEquals("t18 progRAMmers", name);
  }

  @Test
  @DisplayName("Number of supported requests are equal to 4")
  public void testNumberOfSupportedParameters() {
    String[] supportedParameters = conf.getSupportedRequests();
    assertEquals(supportedParameters.length, 4);
  }

  @Test
  @DisplayName("Supported requests are equal to '[\"config\",\"distance\",\"find\", \"trip\"]")
  public void testSupportedParameters() {
    String[] supportedParameter = conf.getSupportedRequests();
    assertEquals("config", supportedParameter[0]);
    assertEquals("distance", supportedParameter[1]);
    assertEquals("find", supportedParameter[2]);
    assertEquals("trip", supportedParameter[3]);
  }
}