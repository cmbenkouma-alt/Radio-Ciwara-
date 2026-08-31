import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:webview_flutter/webview_flutter.dart';

const casterPublicToken = '236f6884-9ad2-465f-a29e-5f349a8dac8e';
const siteBase = 'https://raw.githubusercontent.com/cmbenkouma-alt/Radio-Ciwara-/app-foundation/';
const logoUrl = '${siteBase}logo.jpg';
const newsUrl = '${siteBase}data/news.json';
const scheduleUrl = '${siteBase}data/schedule.json';
const websiteUrl = 'https://ciwara-medias.ml/';
const tvUrl = 'https://ciwara-medias.ml/ciwara-tv.html';
const infoUrl = 'https://ciwara-medias.ml/ciwara-info.html';

void main() => runApp(const RadioCiwaraApp());

class RadioCiwaraApp extends StatelessWidget {
  const RadioCiwaraApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Radio Ciwara 105.5 FM',
        theme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.dark,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFFD4145A),
            brightness: Brightness.dark,
          ),
        ),
        home: const AppShell(),
      );
}

class AppShell extends StatefulWidget {
  const AppShell({super.key});
  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int index = 0;
  final pages = const [
    DirectScreen(),
    ScheduleScreen(),
    PodcastsScreen(),
    NewsScreen(),
    MoreScreen(),
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(
          title: Row(
            children: [
              ClipOval(
                child: Image.network(
                  logoUrl,
                  width: 42,
                  height: 42,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => const Icon(Icons.radio),
                ),
              ),
              const SizedBox(width: 10),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('CIWARA', style: TextStyle(fontWeight: FontWeight.w900)),
                  Text('105.5 FM • Bamako', style: TextStyle(fontSize: 11)),
                ],
              ),
            ],
          ),
        ),
        body: pages[index],
        bottomNavigationBar: NavigationBar(
          selectedIndex: index,
          onDestinationSelected: (i) => setState(() => index = i),
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.radio_outlined),
              selectedIcon: Icon(Icons.radio),
              label: 'Direct',
            ),
            NavigationDestination(
              icon: Icon(Icons.calendar_month_outlined),
              selectedIcon: Icon(Icons.calendar_month),
              label: 'Grille',
            ),
            NavigationDestination(
              icon: Icon(Icons.podcasts_outlined),
              selectedIcon: Icon(Icons.podcasts),
              label: 'Podcasts',
            ),
            NavigationDestination(
              icon: Icon(Icons.newspaper_outlined),
              selectedIcon: Icon(Icons.newspaper),
              label: 'Actus',
            ),
            NavigationDestination(icon: Icon(Icons.menu), label: 'Plus'),
          ],
        ),
        floatingActionButton: index == 0
            ? null
            : FloatingActionButton.extended(
                onPressed: () => setState(() => index = 0),
                icon: const Icon(Icons.radio),
                label: const Text('Direct'),
              ),
      );
}

class DirectScreen extends StatefulWidget {
  const DirectScreen({super.key});
  @override
  State<DirectScreen> createState() => _DirectScreenState();
}

class _DirectScreenState extends State<DirectScreen> {
  late final WebViewController controller;
  bool loaded = false;

  @override
  void initState() {
    super.initState();
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF120108))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (_) {
            if (mounted) setState(() => loaded = true);
          },
        ),
      )
      ..loadHtmlString(_casterHtml);
  }

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.all(18),
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF8E0034), Color(0xFF28000F)],
              ),
              borderRadius: BorderRadius.circular(28),
            ),
            child: Column(
              children: [
                const Text('🔴 EN DIRECT', style: TextStyle(fontWeight: FontWeight.w800)),
                const SizedBox(height: 18),
                ClipOval(
                  child: Image.network(
                    logoUrl,
                    width: 150,
                    height: 150,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => const Icon(Icons.radio, size: 100),
                  ),
                ),
                const SizedBox(height: 16),
                const Text('RADIO CIWARA', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900)),
                const Text('105.5 FM • Bamako, Mali', style: TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 18),
                SizedBox(
                  height: 250,
                  width: double.infinity,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(18),
                    child: Stack(
                      children: [
                        WebViewWidget(controller: controller),
                        if (!loaded) const Center(child: CircularProgressIndicator()),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const _InfoCard(
            icon: Icons.volume_up,
            title: 'Direct Radio Ciwara',
            text: 'Lecteur officiel Caster.fm intégré à l’application.',
          ),
          const _InfoCard(
            icon: Icons.public,
            title: 'Radio Ciwara 105.5 FM',
            text: 'La voix qui rassemble.',
          ),
        ],
      );
}

const _casterHtml = '''<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:#120108;color:#fff;font-family:Arial;overflow:hidden}.cstrEmbed{width:100%;min-height:230px}a{color:#fff}</style></head><body><div class="cstrEmbed" data-type="newStreamPlayer" data-publicToken="$casterPublicToken" data-theme="light" data-color="D4145A" data-channelId="" data-rendered="false"><a href="https://www.caster.fm">Radio Server Hosting</a></div><script src="https://cdn.cloud.caster.fm/widgets/embed.js"></script></body></html>''';

class ScheduleScreen extends StatelessWidget {
  const ScheduleScreen({super.key});

  @override
  Widget build(BuildContext context) => FutureBuilder<String>(
        future: _get(scheduleUrl),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return const _ErrorPage(
              title: 'Grille indisponible',
              text: 'Réessayez lorsque la connexion est disponible.',
            );
          }

          final data = jsonDecode(snapshot.data!);
          final days = (data['days'] as List? ?? []);
          final status = data['status'] == 'provisional';

          return ListView(
            padding: const EdgeInsets.all(18),
            children: [
              const Text('Grille des programmes', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900)),
              const SizedBox(height: 6),
              Text(
                status
                    ? 'Source provisoire — elle sera remplacée par la grille officielle.'
                    : 'Programme officiel de Radio Ciwara.',
                style: const TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 18),
              ...days.map((day) {
                final items = (day['items'] as List? ?? []);
                return Card(
                  child: ExpansionTile(
                    title: Text(day['day']?.toString() ?? ''),
                    children: [
                      ...items.map(
                        (item) => ListTile(
                          leading: const Icon(Icons.access_time),
                          title: Text(item['title']?.toString() ?? ''),
                          subtitle: Text(
                            '${item['time']?.toString() ?? ''} • ${item['description']?.toString() ?? ''}',
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ],
          );
        },
      );
}

class NewsScreen extends StatefulWidget {
  const NewsScreen({super.key});
  @override
  State<NewsScreen> createState() => _NewsScreenState();
}

class _NewsScreenState extends State<NewsScreen> {
  late Future<String> futureNews;

  @override
  void initState() {
    super.initState();
    futureNews = _get(newsUrl);
  }

  Future<void> _refresh() async {
    final fresh = _get(newsUrl);
    setState(() => futureNews = fresh);
    await fresh;
  }

  @override
  Widget build(BuildContext context) => FutureBuilder<String>(
        future: futureNews,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return const _ErrorPage(
              title: 'Actualités indisponibles',
              text: 'Réessayez lorsque la connexion est disponible.',
            );
          }

          final data = jsonDecode(snapshot.data!);
          final items = (data['items'] as List? ?? []);
          if (items.isEmpty) {
            return RefreshIndicator(
              onRefresh: _refresh,
              child: ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(18),
                children: const [
                  Text('Actualités', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900)),
                  SizedBox(height: 8),
                  Text(
                    'Les flux d’actualités seront affichés ici dès que les données RSS seront disponibles.',
                    style: TextStyle(color: Colors.white70),
                  ),
                  SizedBox(height: 24),
                  Icon(Icons.newspaper, size: 64),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _refresh,
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(18),
              children: [
                const Text('Actualités', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900)),
                const Text('Sources configurées : Maliweb et Malijet', style: TextStyle(color: Colors.white70)),
                const SizedBox(height: 16),
                ...items.take(10).map(
                  (news) => Card(
                    child: ListTile(
                      title: Text(
                        news['title']?.toString() ?? '',
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                      ),
                      subtitle: Text(news['source']?.toString() ?? ''),
                      trailing: const Icon(Icons.open_in_new),
                      onTap: () {
                        final link = news['link']?.toString() ?? '';
                        if (link.isNotEmpty) {
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => WebPageScreen(title: 'Actualité', url: link)),
                          );
                        }
                      },
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      );
}

class PodcastsScreen extends StatelessWidget {
  const PodcastsScreen({super.key});
  @override
  Widget build(BuildContext context) => const _Section(
        title: 'Podcasts',
        subtitle: 'Espace prêt pour les vrais podcasts et replays de Radio Ciwara.',
        cards: [
          ('Dernières émissions', Icons.podcasts),
          ('Réécouter', Icons.play_circle_outline),
          ('Archives', Icons.library_music),
        ],
      );
}

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});
  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.all(18),
        children: [
          const Text('Radio Ciwara', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900)),
          const Text('105.5 FM • Bamako, Mali', style: TextStyle(color: Colors.white70)),
          const SizedBox(height: 18),
          _MenuTile(
            icon: Icons.live_tv,
            title: 'Ciwara TV',
            text: 'Ouvrir la page Ciwara TV',
            url: tvUrl,
          ),
          _MenuTile(
            icon: Icons.article,
            title: 'Ciwara Info',
            text: 'Ouvrir la page Ciwara Info',
            url: infoUrl,
          ),
          _MenuTile(
            icon: Icons.language,
            title: 'Site Web',
            text: 'Retrouvez Radio Ciwara en ligne',
            url: websiteUrl,
          ),
          const _MenuTile(
            icon: Icons.favorite,
            title: 'Radio Ciwara',
            text: 'La voix qui rassemble.',
          ),
        ],
      );
}

class _MenuTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String text;
  final String? url;

  const _MenuTile({
    required this.icon,
    required this.title,
    required this.text,
    this.url,
  });

  @override
  Widget build(BuildContext context) => Card(
        child: ListTile(
          leading: Icon(icon),
          title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
          subtitle: Text(text),
          trailing: const Icon(Icons.arrow_forward_ios, size: 15),
          onTap: url == null
              ? null
              : () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => WebPageScreen(title: title, url: url!),
                    ),
                  ),
        ),
      );
}

class WebPageScreen extends StatefulWidget {
  final String title;
  final String url;
  const WebPageScreen({super.key, required this.title, required this.url});

  @override
  State<WebPageScreen> createState() => _WebPageScreenState();
}

class _WebPageScreenState extends State<WebPageScreen> {
  late final WebViewController controller;

  @override
  void initState() {
    super.initState();
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadRequest(Uri.parse(widget.url));
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: Text(widget.title)),
        body: WebViewWidget(controller: controller),
      );
}

class _Section extends StatelessWidget {
  final String title;
  final String subtitle;
  final List<(String, IconData)> cards;

  const _Section({required this.title, required this.subtitle, required this.cards});

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.all(18),
        children: [
          Text(title, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900)),
          Text(subtitle, style: const TextStyle(color: Colors.white70)),
          const SizedBox(height: 18),
          ...cards.map(
            (card) => Card(
              child: ListTile(
                leading: Icon(card.$2),
                title: Text(card.$1),
                trailing: const Icon(Icons.arrow_forward_ios, size: 15),
              ),
            ),
          ),
        ],
      );
}

class _InfoCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String text;

  const _InfoCard({required this.icon, required this.title, required this.text});

  @override
  Widget build(BuildContext context) => Card(
        child: ListTile(
          leading: Icon(icon),
          title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
          subtitle: Text(text),
        ),
      );
}

class _ErrorPage extends StatelessWidget {
  final String title;
  final String text;

  const _ErrorPage({required this.title, required this.text});

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.wifi_off, size: 50),
              const SizedBox(height: 12),
              Text(title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              Text(text, textAlign: TextAlign.center),
            ],
          ),
        ),
      );
}

Future<String> _get(String url) async {
  final response = await http.get(Uri.parse(url));
  if (response.statusCode != 200) {
    throw Exception('HTTP ${response.statusCode}');
  }
  return response.body;
}
