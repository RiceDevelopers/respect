Config = {}

Config.Debug = false
Config.Product = 'Rice Protect Ultimate'

-- auto / esx / qb / qbox / vrp / standalone
Config.Framework = 'auto'

-- Discord webhook. Keep this server-side.
Config.Webhook = ''

Config.ProtectedResources = {
    -- 'mt_inventory',
    -- 'my_paid_resource',
}

Config.License = {
    Enabled = false,
    Endpoint = 'https://YOUR-SITE.netlify.app/v1/heartbeat',
    Key = '',
    HeartbeatSeconds = 300,
    FailClosed = true,
    GraceSeconds = 900
}

Config.Integrity = {
    Enabled = true,
    IntervalSeconds = 60,
    -- Resource state checks only. Source-file hashing is intentionally not
    -- advertised as a bypass-proof anti-dumper because the runtime itself
    -- must have access to files it executes.
}

Config.Security = {
    MaxAuditPerMinutePerPlayer = 10,
    RejectUnknownProtectedResourceState = true
}

Config.Identifiers = {
    discord = true,
    license = true,
    license2 = true,
    fivem = true,
    steam = true,
    xbl = true,
    live = true,
    ip = true
}
