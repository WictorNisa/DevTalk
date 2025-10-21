package com.devtalk.service;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PresenceService {

    private final Map<String, String> sessions = new ConcurrentHashMap<>();

    private final Map<String, Set<String>> subscriptions = new ConcurrentHashMap<>();

    public void registerSession(String sessionId, String username){
        if(sessionId == null) return;
        sessions.put(sessionId, username == null ? "Unknown" : username);
        subscriptions.putIfAbsent(sessionId, ConcurrentHashMap.newKeySet());
    }

    public void addSubscription(String sessionId, String destination){
        if(sessionId == null || destination == null) return;
        subscriptions.computeIfAbsent(sessionId, k -> ConcurrentHashMap.newKeySet()).add(destination);
    }

    public boolean removeSubscription(String sessionId, String destination){
        if(sessionId == null || destination == null) return false;
        Set<String> destSet = subscriptions.get(sessionId);
        return destSet != null && destSet.remove(destination);
    }

    public Set<String> removeSession(String sessionId){
        if(sessionId == null) return Collections.emptySet();
        Set<String> removed = subscriptions.remove(sessionId);
        sessions.remove(sessionId);
        return removed == null ? Collections.emptySet() : new java.util.HashSet<>(removed);
    }

    public String getUsername(String sessionId){
        return sessions.get(sessionId);
    }

    public Set<String> getSubscriptions(String sessionId){
        Set<String> subSet = subscriptions.get(sessionId);
        return subSet == null ? Collections.emptySet() : new HashSet<>(subSet);
    }
}
