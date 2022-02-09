with last_transfer as (
    select
        t."tokenId"
        , max(t.evt_block_number) as last_transfer
    from
        erc721."ERC721_evt_Transfer" t
    where
        t.contract_address = '\x8ed0e7404675d5c7f5b4f2a829138afcaf53d2ab'
        and t.to = '\xe7bd8a7c642e807b820c483f87b28f11a796fb37'
        and t.evt_block_number <= 14134149
    group by
        1
    order by
        1
), transfer as (
    select
        t."tokenId"
        , t.from
        , t.evt_block_number
    from
        erc721."ERC721_evt_Transfer" t
    where
        t.contract_address = '\x8ed0e7404675d5c7f5b4f2a829138afcaf53d2ab'
        and t.to = '\xe7bd8a7c642e807b820c483f87b28f11a796fb37'
        and t.evt_block_number <= 14134149
)
select
    *
from
    last_transfer t1 left join transfer t2 on t1."tokenId" = t2."tokenId" and t1."last_transfer" = t2."evt_block_number"
