<?php

namespace Haus\SyncData\Helpers;

class LockHelper
{
    private static $key = 'haus-ecom-product-sync-lock';
    private static $duration = 3600*12; // Lock duration in seconds, e.g., 12 hour

    public static function abortIfAlreadyRunning()
    {
        if (get_transient(self::$key)) {
            \WP_CLI::error("The command is already running.");
        }
    }

    public static function setLock()
    {
        set_transient(self::$key, true, self::$duration);
    }

    public static function removeLock()
    {
        delete_transient(self::$key);
    }
}