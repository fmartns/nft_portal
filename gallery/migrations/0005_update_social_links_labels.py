# Generated manually on 2025-10-12
# Atualiza verbose_names dos campos de links sociais

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0004_remove_opensea_etherscan'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nftcollection',
            name='website_url',
            field=models.URLField(blank=True, verbose_name='Site Oficial'),
        ),
        migrations.AlterField(
            model_name='nftcollection',
            name='twitter_url',
            field=models.URLField(blank=True, verbose_name='X (Twitter)'),
        ),
        migrations.AlterField(
            model_name='nftcollection',
            name='instagram_url',
            field=models.URLField(blank=True, verbose_name='Instagram'),
        ),
        migrations.AlterField(
            model_name='nftcollection',
            name='discord_url',
            field=models.URLField(blank=True, verbose_name='Discord'),
        ),
        migrations.AlterField(
            model_name='nftcollection',
            name='telegram_url',
            field=models.URLField(blank=True, verbose_name='Telegram'),
        ),
    ]


