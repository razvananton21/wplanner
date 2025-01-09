<?php

namespace App\Runtime;

use Symfony\Component\Runtime\SymfonyRuntime;

class CustomRuntime extends SymfonyRuntime
{
    public function __construct(array $options = [])
    {
        error_log('Debug: CustomRuntime initialized');
        
        // Force production environment
        $_SERVER['APP_ENV'] = $_ENV['APP_ENV'] = 'prod';
        $_SERVER['APP_DEBUG'] = $_ENV['APP_DEBUG'] = '0';
        $_SERVER['APP_SECRET'] = $_ENV['APP_SECRET'] = '2ca64f8d83b9e89f5f19d672841d6bb8';
        $_SERVER['DATABASE_URL'] = $_ENV['DATABASE_URL'] = 'postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8';
        
        // Prevent Dotenv loading
        putenv('SYMFONY_DOTENV_VARS=APP_ENV,APP_DEBUG,APP_SECRET,DATABASE_URL');
        
        error_log('Debug: Environment variables set in CustomRuntime');
        
        parent::__construct($options);
    }
} 