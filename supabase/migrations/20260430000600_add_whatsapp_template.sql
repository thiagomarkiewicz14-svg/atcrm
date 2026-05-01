alter table public.user_settings
add column if not exists whatsapp_visit_template text default
'Olá {client_name}, segue o relatório da visita realizada em {visit_date} na propriedade {farm_name}.

{summary}

Recomendações:
{recommendations}

Próxima visita: {next_visit_date}

Acesse o relatório completo aqui:
{report_link}
';
