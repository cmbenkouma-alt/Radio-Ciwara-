import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

const casterPublicToken = '236f6884-9ad2-465f-a29e-5f349a8dac8e';
const logoUrl = 'https://raw.githubusercontent.com/cmbenkouma-alt/Radio-Ciwara-/main/logo.jpg';

void main() => runApp(const RadioCiwaraApp());

class RadioCiwaraApp extends StatelessWidget {
  const RadioCiwaraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Radio Ciwara 105.5 FM',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF120108),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFD4145A),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const AppShell(),
    );
  }
}

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _index = 0;

  final _titles = const ['Direct', 'Grille', 'Podcasts', 'Actus', 'Contact'];

  @override
  Widget build(BuildContext context) {
    final pages = const [
      DirectScreen(),
      ScheduleScreen(),
      PodcastsScreen(),
      NewsScreen(),
      ContactScreen(),
    ];

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        titleSpacing: 16,
        title: Row(
          children: [
            ClipOval(child: Image.network(logoUrl, width: 42, height: 42, fit: BoxFit.cover)),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('CIWARA', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1)),
                Text('105.5 FM • Bamako', style: Theme.of(context).textTheme.labelSmall),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(Icons.share_outlined)),
        ],
      ),
      body: pages[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.radio_outlined), selectedIcon: Icon(Icons.radio), label: 'Direct'),
          NavigationDestination(icon: Icon(Icons.calendar_month_outlined), selectedIcon: Icon(Icons.calendar_month), label: 'Grille'),
          NavigationDestination(icon: Icon(Icons.podcasts_outlined), selectedIcon: Icon(Icons.podcasts), label: 'Podcasts'),
          NavigationDestination(icon: Icon(Icons.newspaper_outlined), selectedIcon: Icon(Icons.newspaper), label: 'Actus'),
          NavigationDestination(icon: Icon(Icons.favorite_border), selectedIcon: Icon(Icons.favorite), label: 'Contact'),
        ],
      ),
      floatingActionButton: _index == 0
          ? null
          : FloatingActionButton.extended(
              onPressed: () => setState(() => _index = 0),
              icon: const Icon(Icons.radio),
              label: const Text('Direct'),
            ),
    );
  }
}

class DirectScreen extends StatefulWidget {
  const DirectScreen({super.key});

  @override
  State<DirectScreen> createState() => _DirectScreenState();
}

class _DirectScreenState extends State<DirectScreen> {
  late final WebViewController _controller;
  bool _loaded = false;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF120108))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (_) {
            if (mounted) setState(() => _loaded = true);
          },
        ),
      )
      ..loadHtmlString(_casterHtml);
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(18, 8, 18, 28),
      children: [
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF8E0034), Color(0xFF28000F)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(30),
          ),
          child: Column(
            children: [
              const Align(
                alignment: Alignment.centerLeft,
                child: Text('🔴 EN DIRECT', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
              ),
              const SizedBox(height: 22),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: Colors.white24, width: 3)),
                child: ClipOval(child: Image.network(logoUrl, width: 150, height: 150, fit: BoxFit.cover)),
              ),
              const SizedBox(height: 20),
              const Text('RADIO CIWARA', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900)),
              const SizedBox(height: 4),
              const Text('FM 105.5 MHz • Bamako, Mali', style: TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              const Text('Lecteur officiel Caster.fm', style: TextStyle(color: Colors.white70)),
              const SizedBox(height: 18),
              SizedBox(
                height: 250,
                width: double.infinity,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(18),
                  child: Stack(
                    children: [
                      WebViewWidget(controller: _controller),
                      if (!_loaded)
                        const Center(child: CircularProgressIndicator()),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        Row(
          children: const [
            Expanded(child: _QuickCard(icon: Icons.chat, title: 'WhatsApp')),
            SizedBox(width: 10),
            Expanded(child: _QuickCard(icon: Icons.phone, title: 'Appeler')),
            SizedBox(width: 10),
            Expanded(child: _QuickCard(icon: Icons.favorite, title: 'Dédicace')),
          ],
        ),
        const SizedBox(height: 22),
        const Text('Votre voix, votre radio, votre communauté.', textAlign: TextAlign.center, style: TextStyle(color: Colors.white70)),
      ],
    );
  }
}

const _casterHtml = '''
<!doctype html>
<html lang="fr">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>
html,body{margin:0;padding:0;background:#120108;color:#fff;font-family:Arial,sans-serif;min-height:100%;overflow:hidden}
.wrap{padding:4px;box-sizing:border-box}
.cstrEmbed{width:100%;min-height:230px}
a{color:#fff}
</style>
</head>
<body>
<div class="wrap">
<div class="cstrEmbed" data-type="newStreamPlayer" data-publicToken="$casterPublicToken" data-theme="light" data-color="D4145A" data-channelId="" data-rendered="false">
<a href="https://www.caster.fm">Shoutcast Hosting</a>
<a href="https://www.caster.fm">Stream Hosting</a>
<a href="https://www.caster.fm">Radio Server Hosting</a>
</div>
</div>
<script src="https://cdn.cloud.caster.fm/widgets/embed.js"></script>
</body>
</html>
''';

class _QuickCard extends StatelessWidget {
  final IconData icon;
  final String title;
  const _QuickCard({required this.icon, required this.title});
  @override
  Widget build(BuildContext context) => Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Column(children: [Icon(icon), const SizedBox(height: 7), Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700))]),
        ),
      );
}

class ScheduleScreen extends StatelessWidget {
  const ScheduleScreen({super.key});
  @override
  Widget build(BuildContext context) => const _SectionPage(title: 'Grille des programmes', subtitle: 'Les programmes seront reliés aux données réelles du site.', items: ['Données à connecter', 'Grille hebdomadaire', 'Émission en cours']);
}

class PodcastsScreen extends StatelessWidget {
  const PodcastsScreen({super.key});
  @override
  Widget build(BuildContext context) => const _SectionPage(title: 'Podcasts', subtitle: 'Les podcasts seront reliés aux sources réelles de Radio Ciwara.', items: ['Catalogue des podcasts', 'Dernières émissions', 'Réécouter']);
}

class NewsScreen extends StatelessWidget {
  const NewsScreen({super.key});
  @override
  Widget build(BuildContext context) => const _SectionPage(title: 'Actualités', subtitle: 'Les flux RSS et contenus réels seront connectés à cette section.', items: ['À la une', 'Actualités locales', 'Radio Ciwara']);
}

class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});
  @override
  Widget build(BuildContext context) => const _SectionPage(title: 'Contact', subtitle: 'Radio Ciwara 105.5 FM • Bamako, Mali', items: ['WhatsApp', 'Appeler Radio Ciwara', 'Envoyer une dédicace', 'Visiter le site Web']);
}

class _SectionPage extends StatelessWidget {
  final String title;
  final String subtitle;
  final List<String> items;
  const _SectionPage({required this.title, required this.subtitle, required this.items});
  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(title, style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w900)),
          const SizedBox(height: 8),
          Text(subtitle, style: const TextStyle(color: Colors.white70)),
          const SizedBox(height: 22),
          ...items.map((item) => Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  leading: const CircleAvatar(child: Icon(Icons.chevron_right)),
                  title: Text(item, style: const TextStyle(fontWeight: FontWeight.w700)),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                ),
              )),
        ],
      );
}
