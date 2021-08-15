package com.tco.requests;

import com.tco.misc.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.HashMap;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;

import com.tco.misc.DatabaseQuerier;

public class RequestConfig extends RequestHeader {

    private String[] supportedRequests = {"config","distance", "find", "trip"};
    private String serverName;
    private final transient Logger log = LoggerFactory.getLogger(RequestConfig.class);
    private Map<String, String[]> filters;

    @Override
    public void buildResponse() {
        this.serverName = "t18 progRAMmers";
        this.filters = this.addFilters();
        log.trace("buildResponse -> {}", this);
    }

    public RequestConfig() {
        this.requestType = "config";
        this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
    }

    public String[] getSupportedRequests() {
        return supportedRequests;
    }

    public String getServerName() {
        return serverName;
    }

    public Map<String, String[]> addFilters(){
        Map<String, String[]> setFilters = new HashMap<String, String[]>();
        setFilters.put("type", new String[]{"airport", "heliport", "balloonport"});
        setFilters.put("where", this.getCountries());
        return setFilters;
    }

    public String[] getCountries() {
        DatabaseQuerier querier = new DatabaseQuerier();
        try {
            // iterate through query results and print out the column values
            ResultSet numResults = querier.query("SELECT COUNT(DISTINCT(name)) FROM country;");
            numResults.next();
            Integer num = numResults.getInt("COUNT(DISTINCT(name))");

            ResultSet results = querier.query("SELECT DISTINCT(name) FROM country;");
            String countries[] = new String[num - 2];

            Integer place = 0;

            while(place < countries.length) {
                results.next();
                countries[place] = results.getString("name");
                place++;
            }
            return countries;
        } catch (Exception e) {
            log.error("Exception: LOOK HERE--->" + e.getMessage());
            return null;
        }
    }
}
