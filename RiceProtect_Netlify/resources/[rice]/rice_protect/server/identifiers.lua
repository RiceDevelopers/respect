function RPIdentifiers(src)
    local result = {
        name = GetPlayerName(src) or 'Unknown',
        source = tostring(src)
    }

    for _, identifier in ipairs(GetPlayerIdentifiers(src)) do
        local kind, value = identifier:match('([^:]+):(.+)')
        if kind and Config.Identifiers[kind] then
            result[kind] = value
        end
    end

    return result
end

exports('GetPlayerIdentifiers', RPIdentifiers)
