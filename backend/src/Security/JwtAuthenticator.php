<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Security\Authenticator\JWTAuthenticator as BaseJWTAuthenticator;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\HttpFoundation\Request;

class JwtAuthenticator extends BaseJWTAuthenticator
{
    public function authenticate(Request $request): Passport
    {
        try {
            return parent::authenticate($request);
        } catch (AuthenticationException $e) {
            throw new AuthenticationException('Invalid JWT token');
        }
    }
} 