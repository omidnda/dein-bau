from django.db import migrations, models
import django.db.models.deletion


def copy_explicit_projects(apps, schema_editor):
    from django.utils.text import slugify
    Section = apps.get_model('main', 'ContentSection')
    Project = apps.get_model('main', 'GalleryProject')
    ProjectMedia = apps.get_model('main', 'GalleryProjectMedia')
    Media = apps.get_model('main', 'MediaAsset')
    section = Section.objects.filter(key='site').first()
    value = section.value if section and isinstance(section.value, dict) else {}
    gallery = value.get('gallery') or {}
    projects = gallery.get('projects', []) if isinstance(gallery, dict) else []
    if not isinstance(projects, list):
        return
    for index, old in enumerate(projects):
        if not isinstance(old, dict) or not isinstance(old.get('title'), str) or not old['title'].strip() or not isinstance(old.get('mediaIds'), list):
            continue
        ids = list(dict.fromkeys(int(value) for value in old['mediaIds'] if str(value).isdigit()))
        valid = set(Media.objects.filter(pk__in=ids).values_list('pk', flat=True))
        if not valid:
            continue
        base = slugify(old['title'])[:42] or 'projekt'
        slug, suffix = base, 2
        while Project.objects.filter(slug=slug).exists():
            slug, suffix = f'{base}-{suffix}', suffix + 1
        project = Project.objects.create(title=old['title'][:160], slug=slug,
            description=old.get('text', '') if isinstance(old.get('text', ''), str) else '', published=True, sort_order=index)
        for order, media_id in enumerate(ids):
            if media_id in valid:
                ProjectMedia.objects.create(project=project, media_id=media_id, sort_order=order)


class Migration(migrations.Migration):
    dependencies = [('main', '0001_initial')]
    operations = [
        migrations.CreateModel(name='GalleryProject', fields=[
            ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ('title', models.CharField(max_length=160, verbose_name='Titel')),
            ('slug', models.SlugField(unique=True, verbose_name='URL')),
            ('description', models.TextField(blank=True, verbose_name='Beschreibung')),
            ('location', models.CharField(blank=True, max_length=160, verbose_name='Ort')),
            ('category', models.CharField(blank=True, max_length=80, verbose_name='Kategorie')),
            ('published', models.BooleanField(default=False, verbose_name='Veröffentlicht')),
            ('sort_order', models.PositiveIntegerField(default=0, verbose_name='Reihenfolge')),
            ('cover', models.ForeignKey(blank=True, limit_choices_to={'media_type': 'image'}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='main.mediaasset', verbose_name='Titelbild')),
        ], options={'ordering': ('sort_order', 'pk'), 'verbose_name': 'Projekt', 'verbose_name_plural': 'Projekte'}),
        migrations.CreateModel(name='GalleryProjectMedia', fields=[
            ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ('sort_order', models.PositiveIntegerField(default=0, verbose_name='Reihenfolge')),
            ('media', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.mediaasset', verbose_name='Medium')),
            ('poster', models.ForeignKey(blank=True, limit_choices_to={'media_type': 'image'}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='main.mediaasset', verbose_name='Videovorschaubild')),
            ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.galleryproject')),
        ], options={'ordering': ('sort_order', 'pk'), 'verbose_name': 'Projektmedium', 'verbose_name_plural': 'Projektmedien', 'constraints': [models.UniqueConstraint(fields=('project', 'media'), name='unique_gallery_project_media')]}),
        migrations.AddField(model_name='galleryproject', name='media', field=models.ManyToManyField(related_name='gallery_projects', through='main.GalleryProjectMedia', through_fields=('project', 'media'), to='main.mediaasset')),
        migrations.RunPython(copy_explicit_projects, migrations.RunPython.noop),
    ]
