Framework = {
    name = 'standalone',
    object = nil
}

local function started(name)
    return GetResourceState(name) == 'started'
end

local function detect()
    if Config.Framework ~= 'auto' then
        return Config.Framework
    end

    if started('qbx_core') then return 'qbox' end
    if started('qb-core') then return 'qb' end
    if started('es_extended') then return 'esx' end
    if started('vrp') or started('vRP') then return 'vrp' end

    return 'standalone'
end

CreateThread(function()
    Wait(1500)
    Framework.name = detect()

    if Framework.name == 'qb' then
        Framework.object = exports['qb-core']:GetCoreObject()
    elseif Framework.name == 'esx' then
        Framework.object = exports['es_extended']:getSharedObject()
    elseif Framework.name == 'qbox' then
        Framework.object = exports.qbx_core
    end

    RPLog('Framework: ' .. Framework.name)
end)
