local function apiUrl(path)
    local base = tostring(Config.License.Endpoint or ''):gsub('/v1/heartbeat$', ''):gsub('/+$', '')
    return base .. path
end

local function protectedResource(name)
    for _, resource in ipairs(Config.ProtectedResources) do
        if resource == name then return true end
    end
    return false
end

function RPPanelEvent(kind, severity, details, resource, player)
    if not Config.License.Enabled or Config.License.Key == '' then return end
    PerformHttpRequest(apiUrl('/v1/event'), function() end, 'POST', json.encode({
        key = Config.License.Key,
        type = kind,
        severity = severity or 'info',
        details = details or '',
        resource = resource or '',
        serverName = GetConvar('sv_projectName', 'unknown'),
        player = player
    }), {['Content-Type']='application/json'})
end

function RPPanelPlayer(src, action, reason)
    if not Config.License.Enabled or Config.License.Key == '' then return end
    local p = RPIdentifiers(src)
    PerformHttpRequest(apiUrl('/v1/player'), function() end, 'POST', json.encode({
        key = Config.License.Key,
        sessionId = (p.license or p.fivem or tostring(src)) .. ':' .. tostring(os.time()),
        action = action,
        name = p.name,
        serverPlayerId = tostring(src),
        discord = p.discord,
        fivem = p.fivem,
        license = p.license,
        steam = p.steam,
        ip = p.ip,
        reason = reason or ''
    }), {['Content-Type']='application/json'})
end

function RPPanelSnapshot()
    local resources = {}
    for _, resource in ipairs(Config.ProtectedResources) do
        resources[#resources+1] = {name=resource, state=GetResourceState(resource)}
    end
    return resources
end

function RPPanelCommands(commands)
    if type(commands) ~= 'table' then return end
    for _, cmd in ipairs(commands) do
        local resource = tostring(cmd.resource or '')
        if (cmd.action == 'disable_resource' or cmd.action == 'enable_resource') and protectedResource(resource) and resource ~= GetCurrentResourceName() then
            if cmd.action == 'disable_resource' then
                StopResource(resource)
                RPPanelEvent('Remote Resource Disabled', 'critical', 'Command ID: '..tostring(cmd.id), resource)
            else
                StartResource(resource)
                RPPanelEvent('Remote Resource Enabled', 'warning', 'Command ID: '..tostring(cmd.id), resource)
            end
        elseif cmd.action == 'update_settings' then
            RPPanelEvent('Remote Settings Update Received', 'info', 'Settings command received; apply only explicitly supported settings.')
        end
    end
end
