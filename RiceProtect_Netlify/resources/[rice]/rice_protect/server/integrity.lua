CreateThread(function()
    if not Config.Integrity.Enabled then return end

    Wait(5000)

    while true do
        for _, resource in ipairs(Config.ProtectedResources) do
            local state = GetResourceState(resource)

            if state == 'missing' or state == 'unknown' then
                if RPPanelEvent then RPPanelEvent('Protected Resource Changed', 'warning', ('Resource state: %s'):format(state), resource) end
                RPWebhook(
                    '🚨 Protected Resource Problem',
                    ('Resource `%s` is `%s`.'):format(resource, state),
                    15158332,
                    nil,
                    {
                        {name='Resource', value='`'..resource..'`', inline=true},
                        {name='State', value='`'..state..'`', inline=true}
                    }
                )
            end
        end

        Wait(Config.Integrity.IntervalSeconds * 1000)
    end
end)
