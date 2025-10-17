# Generated manually on 2025-10-12
# Remove campos opensea_url e etherscan_url

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0003_alter_nftcollection_cover_image_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='nftcollection',
            name='opensea_url',
        ),
        migrations.RemoveField(
            model_name='nftcollection',
            name='etherscan_url',
        ),
    ]


