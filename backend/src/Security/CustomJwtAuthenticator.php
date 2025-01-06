<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Security\Authenticator\JWTAuthenticator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Psr\Log\LoggerInterface;

class CustomJwtAuthenticator extends JWTAuthenticator
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function authenticate(Request $request): Passport
    {
        $this->logger->info('Attempting to authenticate request', [
            'headers' => $request->headers->all(),
            'authorization' => $request->headers->get('Authorization'),
            'method' => $request->getMethod(),
            'path' => $request->getPathInfo(),
            'query' => $request->query->all(),
            'cookies' => $request->cookies->all(),
        ]);

        try {
            $passport = parent::authenticate($request);
            $this->logger->info('Authentication successful', [
                'user' => $passport->getUser()->getUserIdentifier(),
                'credentials' => $passport->hasBadge('credentials'),
            ]);
            return $passport;
        } catch (AuthenticationException $e) {
            $this->logger->error('Authentication failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'token' => $request->headers->get('Authorization'),
            ]);
            throw $e;
        }
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        $this->logger->info('Authentication successful', [
            'user' => $token->getUserIdentifier(),
            'roles' => $token->getRoleNames(),
            'firewall' => $firewallName,
        ]);
        return parent::onAuthenticationSuccess($request, $token, $firewallName);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $this->logger->error('Authentication failure', [
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
            'token' => $request->headers->get('Authorization'),
            'request_uri' => $request->getRequestUri(),
        ]);
        return parent::onAuthenticationFailure($request, $exception);
    }
} 