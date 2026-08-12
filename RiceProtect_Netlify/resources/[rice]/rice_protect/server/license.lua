License = {
    valid = not Config.License.Enabled,
    lastOK = 0,
    reason = Config.License.Enabled and 'pending' or 'disabled'
}

local function heartbeat()
    if not Config.License.Enabled then
        License.valid = true
        License.reason = 'disabled'
        return
    end

    if Config.License.Endpoint == '' or Config.License.Key == '' then
        License.valid = false
        License.reason = 'missing-config'
        RPWebhook('🚨 License Configuration Error',
            'Endpoint or key is missing.',
            15158332)
        return
    end

    local payload = {
        product = Config.Product,
        key = Config.License.Key,
        serverName = GetConvar('sv_projectName', 'unknown'),
        serverLicense = GetConvar('sv_licenseKey', ''),
        endpoint = GetConvar('endpoint_add_tcp', 'unknown'),
        framework = Framework and Framework.name or 'unknown',
        protectVersion = GetResourceMetadata(GetCurrentResourceName(), 'version', 0) or 'unknown',
        playerCount = #GetPlayers(),
        maxPlayers = tonumber(GetConvar('sv_maxclients', '0')) or 0,
        resources = RPPanelSnapshot and RPPanelSnapshot() or {}
    }

    PerformHttpRequest(
        Config.License.Endpoint,
        function(status, body)
            if status ~= 200 or not body then
                local grace = os.time() - License.lastOK
                License.valid = (License.lastOK > 0 and grace <= Config.License.GraceSeconds)
                License.reason = 'api-unavailable'

                RPWebhook('🚨 License API Unavailable',
                    ('HTTP `%s`; grace active: `%s`'):format(status, tostring(License.valid)),
                    15158332)
                return
            end

            local ok, data = pcall(json.decode, body)
            if not ok or type(data) ~= 'table' or data.valid ~= true then
                License.valid = false
                License.reason = 'rejected'
                RPWebhook('🛑 License Rejected',
                    'Remote license service rejected this installation.',
                    15158332)
                return
            end

            License.valid = true
            License.reason = 'ok'
            License.lastOK = os.time()
            if RPPanelCommands then RPPanelCommands(data.commands) end
        end,
        'POST',
        json.encode(payload),
        {['Content-Type']='application/json'}
    )
end

CreateThread(function()
    heartbeat()

    while Config.License.Enabled do
        Wait(Config.License.HeartbeatSeconds * 1000)
        heartbeat()
    end
end)

exports('LicenseValid', function()
    return License.valid
end)
