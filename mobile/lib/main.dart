import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';

const streamUrl = 'https://uk5freenew.listen2myradio.com/live.mp3?typeportmount=s1_35628_stream_416941156';
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
  final AudioPlayer _player = AudioPlayer();
  bool _loading = false;
  String _status = 'Prêt à écouter la radio';

  final _titles = const ['Direct', 'Grille', 'Podcasts', 'Actus', 'Contact'];

  Future<void> _toggleLive() async {
    if (_player.playing) {
      await _player.pause();
      if (mounted) setState(() => _status = 'Lecture en pause');
      return;
    }

    setState(() {
      _loading = true;
      _status = 'Connexion au direct…';
    });

    try {
      await _player.setUrl(streamUrl);
      await _player.play();
      if (mounted) {
        setState(() {
          _loading = false;
          _status = '🔴 Radio Ciwara 105.5 FM — EN DIRECT';
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _loading = false;
          _status = 'Flux momentanément indisponible';
        });
      }
    }
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      DirectScreen(
        playing: _player.playing,
        loading: _loading,
        status: _status,
        onToggle: _toggleLive,
      ),
      const ScheduleScreen(),
      const PodcastsScreen(),
      const NewsScreen(),
      const ContactScreen(),
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
      floatingActionButton: _index == 0 ? null : FloatingActionButton.extended(
        onPressed: _toggleLive,
        icon: Icon(_player.playing ? Icons.pause : Icons.play_arrow),
        label: Text(_player.playing ? 'Pause' : 'Direct'),
      ),
    );
  }
}

class DirectScreen extends StatelessWidget {
  final bool playing;
  final bool loading;
  final String status;
  final VoidCallback onToggle;

  const DirectScreen({super.key, required this.playing, required this.loading, required this.status, required this.onToggle});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(18, 8, 18, 28),
      children: [
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Color(0xFF8E0034), Color(0xFF28000F)], begin: Alignment.topLeft, end: Alignment.bottomRight),
            borderRadius: BorderRadius.circular(30),
          ),
          child: Column(
            children: [
              Align(alignment: Alignment.centerLeft, child: Text(playing ? '● EN DIRECT' : '● HORS LIGNE', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800))),
              const SizedBox(height: 28),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: Colors.white24, width: 3)),
                child: ClipOval(child: Image.network(logoUrl, width: 190, height: 190, fit: BoxFit.cover)),
              ),
              const SizedBox(height: 24),
              const Text('RADIO CIWARA', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900)),
              const SizedBox(height: 4),
              const Text('FM 105.5 MHz • Bamako, Mali', style: TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              const Text('Direct Studio FM (HD Live)', style: TextStyle(color: Colors.white70)),
              const SizedBox(height: 24),
              Text(status, textAlign: TextAlign.center, style: const TextStyle(color: Colors.white70)),
              const SizedBox(height: 20),
              FilledButton(
                onPressed: loading ? null : onToggle,
                style: FilledButton.styleFrom(shape: const CircleBorder(), padding: const EdgeInsets.all(25)),
                child: loading ? const SizedBox(width: 32, height: 32, child: CircularProgressIndicator(strokeWidth: 3)) : Icon(playing ? Icons.pause : Icons.play_arrow, size: 44),
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

class _QuickCard extends StatelessWidget {
  final IconData icon;
  final String title;
  const _QuickCard({required this.icon, required this.title});
  @override
  Widget build(BuildContext context) => Card(child: Padding(padding: const EdgeInsets.symmetric(vertical: 16), child: Column(children: [Icon(icon), const SizedBox(height: 7), Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700))])));
}

class ScheduleScreen extends StatelessWidget {
  const ScheduleScreen({super.key});
  @override
  Widget build(BuildContext context) => const _SectionPage(title: 'Grille des programmes', subtitle: 'Retrouvez les rendez-vous de Radio Ciwara 105.5 FM.', items: ['La Matinale Ciwara', 'La voix de Ciwara', 'Ciwara Music', 'Ciwara Infos']);
}

class PodcastsScreen extends StatelessWidget {
  const PodcastsScreen({super.key});
  @override
  Widget build(BuildContext context) => const _SectionPage(title: 'Podcasts', subtitle: 'Réécoutez les meilleurs moments de l’antenne.', items: ['Les rendez-vous de Ciwara', 'La voix de la communauté', 'Ciwara Infos']);
}

class NewsScreen extends StatelessWidget {
  const NewsScreen({super.key});
  @override
  Widget build(BuildContext context) => const _SectionPage(title: 'Actualités', subtitle: 'Les informations, événements et sujets de votre communauté.', items: ['À la une de Ciwara', 'Culture et vie locale', 'Les voix de Ciwara']);
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
  Widget build(BuildContext context) => ListView(padding: const EdgeInsets.all(20), children: [Text(title, style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w900)), const SizedBox(height: 8), Text(subtitle, style: const TextStyle(color: Colors.white70)), const SizedBox(height: 22), ...items.map((item) => Card(margin: const EdgeInsets.only(bottom: 12), child: ListTile(leading: const CircleAvatar(child: Icon(Icons.play_arrow)), title: Text(item, style: const TextStyle(fontWeight: FontWeight.w700)), trailing: const Icon(Icons.chevron_right))))]);
}
