package com.devtalk.service;

import com.devtalk.model.User;
import com.devtalk.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {

    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        if(oAuth2User.getAttributes().get("id") == null) {
            throw new OAuth2AuthenticationException("OAuth2 provider did not return an id attribute");
        }
        String externalId = oAuth2User.getAttributes().get("id").toString();
        if(oAuth2User.getAttributes().get("login") == null) {
            throw new OAuth2AuthenticationException("OAuth2 provider did not return a login attribute");
        }
        String displayName = oAuth2User.getAttributes().get("login").toString();
        if(oAuth2User.getAttributes().get("avatar_url") == null) {
            throw new OAuth2AuthenticationException("OAuth2 provider did not return an avatar_url attribute");
        }
        String avatarUrl = oAuth2User.getAttributes().get("avatar_url").toString();
        userRepository.findByExternalId(externalId).orElseGet(() -> {
            User newUser = User.builder()
                    .externalId(externalId)
                    .displayName(displayName)
                    .avatarUrl(avatarUrl)
                    .build();
            return userRepository.save(newUser);

        });
        return oAuth2User;
    }
}
