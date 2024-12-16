package org.example.backend.security;

import jdk.jshell.spi.ExecutionControl;
import lombok.RequiredArgsConstructor;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> findUser = userRepository.findByUserEmail(username);
        if (findUser.isPresent()) {
            User user = findUser.get();
            return new UserDetailsImpl(user.getUserEmail(), user.getUserPassword(), "ROLE_USER");
        }
        throw new UserNotFoundException("User not found with userEmail: " + username);
    }
}
