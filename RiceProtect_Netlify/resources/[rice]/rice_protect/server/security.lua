local buckets = {}

local function allowed(src)
    local now = os.time()
    local b = buckets[src]

    if not b or now - b.window >= 60 then
        buckets[src] = {window = now, count = 1}
        return true
    end

    b.count = b.count + 1
    return b.count <= Config.Security.MaxAuditPerMinutePerPlayer
end

RegisterNetEvent('rice_protect:server:audit', function(kind, details)
    local src = source

    if not allowed(src) then
        RPWebhook(
            '🚨 Audit Rate Limit',
            'A player exceeded the security audit rate limit.',
            15158332,
            src
        )
        return
    end

    kind = tostring(kind or 'unknown')
    details = tostring(details or '')

    if #details > 1200 then
        details = details:sub(1, 1200) .. '...'
    end

    if RPPanelEvent then RPPanelEvent('Security Audit', 'critical', ('Type: %s | %s'):format(kind, details), '', RPIdentifiers(src)) end

    RPWebhook(
        '🚨 Security Audit',
        ('Type: `%s`\\nDetails: `%s`'):format(kind, details),
        15158332,
        src,
        {{name='Framework', value='`'..Framework.name..'`', inline=true}}
    )
end)

exports('Audit', function(src, kind, details)
    if not src then return false end
    TriggerEvent('rice_protect:server:audit', kind, details)
    return true
end)
