import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';

const streamUrl =
    'https://uk5freenew.listen2myradio.com/live.mp3?typeportmount=s1_35628_stream_416941156';
const logoUrl =
    'https://raw.githubusercontent.com/cmbenkouma-alt/Radio-Ciwara-/main/logo.jpg';

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
        scaffoldBackgroundColor: const Color(0xFF17030A),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFD4145A),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const DirectScreen(),
    );
  }
}

class DirectScreen extends StatefulWidget {
  const DirectScreen({super.key});

  @override
  State<DirectScreen> createState() => _DirectScreenState();
}

class _DirectScreenState extends State<DirectScreen> {
  final AudioPlayer _player = AudioPlayer();
  bool _loading = false;
  String _status = 'Prêt à écouter la radio';

  Future<void> _toggle() async {
    if (_player.playing) {
      await _player.pause();
      setState(() => _status = 'Lecture en pause');
      return;
    }

    setState(() {
      _loading = true;
      _status = 'Connexion au direct…';
    });

    try {
      if (_player.audioSource == null) {
        await _player.setUrl(streamUrl);
      }
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
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 12),
          child: Column(
            children: [
              Row(
                children: [
                  ClipOval(
                    child: Image.network(logoUrl, width: 48, height: 48, fit: BoxFit.cover),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('CIWARA', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
                        Text('105.5 FM • Bamako', style: TextStyle(fontSize: 12)),
                      ],
                    ),
                  ),
                  const Text('🇲🇱', style: TextStyle(fontSize: 22)),
                ],
              ),
              const SizedBox(height: 22),
              Expanded(
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF8E0034), Color(0xFF26000F)],
                    ),
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Align(
                        alignment: Alignment.topLeft,
                        child: Text('●  HORS LIGNE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: Colors.white24, width: 3)),
                        child: ClipOval(
                          child: Image.network(logoUrl, width: 190, height: 190, fit: BoxFit.cover),
                        ),
                      ),
                      const SizedBox(height: 22),
                      const Text('RADIO CIWARA', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900)),
                      const Text('FM  105.5 MHz • Bamako, Mali', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
                      const SizedBox(height: 6),
                      const Text('Direct Studio FM (HD Live)', style: TextStyle(color: Colors.white70)),
                      const SizedBox(height: 28),
                      Text(_status, textAlign: TextAlign.center, style: const TextStyle(color: Colors.white70)),
                      const SizedBox(height: 24),
                      FilledButton(
                        onPressed: _loading ? null : _toggle,
                        style: FilledButton.styleFrom(
                          shape: const CircleBorder(),
                          padding: const EdgeInsets.all(25),
                        ),
                        child: _loading
                            ? const SizedBox(width: 30, height: 30, child: CircularProgressIndicator(strokeWidth: 3))
                            : Icon(_player.playing ? Icons.pause : Icons.play_arrow, size: 42),
                      ),
                      const Spacer(),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              const Text('Direct  •  Grille  •  Podcasts  •  Actus  •  Contact', style: TextStyle(fontSize: 12, color: Colors.white60)),
            ],
          ),
        ),
      ),
    );
  }
}
