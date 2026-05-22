insert into public.applications (name, founder, email, project, score, tier, status)
select
  seed.name,
  seed.founder,
  seed.email,
  seed.project,
  seed.score,
  seed.tier::public.application_tier,
  seed.status::public.application_status
from (
  values
    (
      'Nexus Labs',
      'Aria Chen',
      'aria@nexus.example',
      'Decentralized physical infrastructure network (DePIN) for local browser model compute sharing.',
      96,
      'Elite Resident',
      'pending'
    ),
    (
      'Zephyr Systems',
      'Marcus Vance',
      'marcus@zephyr.example',
      'Zero-latency audio-to-audio conversational agents running on lightweight edge matrices.',
      89,
      'Incubator',
      'pending'
    ),
    (
      'Solaris Bio',
      'Dr. Elena Rostova',
      'elena@solaris.example',
      'Generative protein engineering workflow models accelerated via multi-node H100 clusters.',
      93,
      'Elite Resident',
      'pending'
    ),
    (
      'Crux AI',
      'Devon Miller',
      'devon@crux.example',
      'Collaborative developer sandbox layer incorporating dynamic semantic code indexing.',
      82,
      'Core Builder',
      'pending'
    )
) as seed(name, founder, email, project, score, tier, status)
where not exists (
  select 1
  from public.applications existing
  where existing.name = seed.name
    and existing.founder = seed.founder
);

insert into public.logs (source, message, type)
select seed.source, seed.message, seed.type::public.log_type
from (
  values
    ('ALGOFORCE_GRID', 'Node 12 auto-scaled to meet H100 GPU compute spike.', 'info'),
    ('WAITLIST_SVC', 'New application received from AuraAI (Score: 94/100).', 'success'),
    ('BROADCAST_TWR', 'Weekly ecosystem digest sent successfully to 1,420 members.', 'success'),
    ('SECURITY_AUTH', 'Admin role initialized with cryptographically signed token.', 'info')
) as seed(source, message, type)
where not exists (
  select 1
  from public.logs existing
  where existing.source = seed.source
    and existing.message = seed.message
);
