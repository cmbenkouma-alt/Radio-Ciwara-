import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:webview_flutter/webview_flutter.dart';

const casterPublicToken = '236f6884-9ad2-465f-a29e-5f349a8dac8e';
const streamUrl = 'https://uk5freenew.listen2myradio.com/live.mp3?typeportmount=s1_35628_stream_416941156';
const siteBase = 'https://raw.githubusercontent.com/cmbenkouma-alt/Radio-Ciwara-/app-foundation/';
const logoUrl = '${siteBase}logo.jpg';
const newsUrl = '${siteBase}data/news.json';
const scheduleUrl = '${siteBase}data/schedule.json';
const youtubeChannelUrl = 'https://www.youtube.com/';

void main() => runApp(const RadioCiwaraApp());

class RadioCiwaraApp extends StatelessWidget {
  const RadioCiwaraApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    title: 'Radio Ciwara 105.5 FM',
    theme: ThemeData(useMaterial3: true, brightness: Brightness.dark, colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFD4145A), brightness: Brightness.dark)),
    home: const AppShell(),
  );
}

class AppShell extends StatefulWidget { const AppShell({super.key}); @override State<AppShell> createState() => _AppShellState(); }
class _AppShellState extends State<AppShell> {
  int index = 0;
  final pages = const [DirectScreen(), ScheduleScreen(), PodcastsScreen(), NewsScreen(), MoreScreen()];
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Row(children: [ClipOval(child: Image.network(logoUrl, width: 42, height: 42, fit: BoxFit.cover, errorBuilder: (_,__,___)=>const Icon(Icons.radio))), const SizedBox(width: 10), const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('CIWARA', style: TextStyle(fontWeight: FontWeight.w900)), Text('105.5 FM • Bamako', style: TextStyle(fontSize: 11))])])),
    body: pages[index],
    bottomNavigationBar: NavigationBar(selectedIndex: index, onDestinationSelected: (i)=>setState(()=>index=i), destinations: const [NavigationDestination(icon: Icon(Icons.radio_outlined), selectedIcon: Icon(Icons.radio), label:'Direct'), NavigationDestination(icon: Icon(Icons.calendar_month_outlined), selectedIcon: Icon(Icons.calendar_month), label:'Grille'), NavigationDestination(icon: Icon(Icons.podcasts_outlined), selectedIcon: Icon(Icons.podcasts), label:'Podcasts'), NavigationDestination(icon: Icon(Icons.newspaper_outlined), selectedIcon: Icon(Icons.newspaper), label:'Actus'), NavigationDestination(icon: Icon(Icons.menu), label:'Plus')]),
    floatingActionButton: index == 0 ? null : FloatingActionButton.extended(onPressed: ()=>setState(()=>index=0), icon: const Icon(Icons.radio), label: const Text('Direct')),
  );
}

class DirectScreen extends StatefulWidget { const DirectScreen({super.key}); @override State<DirectScreen> createState()=>_DirectScreenState(); }
class _DirectScreenState extends State<DirectScreen> {
  late final WebViewController controller; bool loaded=false;
  @override void initState(){super.initState(); controller=WebViewController()..setJavaScriptMode(JavaScriptMode.unrestricted)..setBackgroundColor(const Color(0xFF120108))..setNavigationDelegate(NavigationDelegate(onPageFinished:(_){if(mounted)setState(()=>loaded=true);} ))..loadHtmlString(_casterHtml);}
  @override Widget build(BuildContext context)=>ListView(padding:const EdgeInsets.all(18),children:[Container(padding:const EdgeInsets.all(24),decoration:BoxDecoration(gradient:const LinearGradient(colors:[Color(0xFF8E0034),Color(0xFF28000F)]),borderRadius:BorderRadius.circular(28)),child:Column(children:[const Text('🔴 EN DIRECT',style:TextStyle(fontWeight:FontWeight.w800)),const SizedBox(height:18),ClipOval(child:Image.network(logoUrl,width:150,height:150,fit:BoxFit.cover,errorBuilder:(_,__,___)=>const Icon(Icons.radio,size:100))),const SizedBox(height:16),const Text('RADIO CIWARA',style:TextStyle(fontSize:30,fontWeight:FontWeight.w900)),const Text('105.5 FM • Bamako, Mali',style:TextStyle(fontWeight:FontWeight.w700)),const SizedBox(height:18),SizedBox(height:250,width:double.infinity,child:ClipRRect(borderRadius:BorderRadius.circular(18),child:Stack(children:[WebViewWidget(controller:controller),if(!loaded)const Center(child:CircularProgressIndicator())])))])),const SizedBox(height:20),const _InfoCard(icon:Icons.volume_up,title:'Direct Radio Ciwara',text:'Écoutez le flux officiel Caster.fm.'),const _InfoCard(icon:Icons.public,title:'Radio Ciwara 105.5 FM',text:'La voix qui rassemble.')]);
}
const _casterHtml='''<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:#120108;color:#fff;font-family:Arial;overflow:hidden}.cstrEmbed{width:100%;min-height:230px}a{color:#fff}</style></head><body><div class="cstrEmbed" data-type="newStreamPlayer" data-publicToken="$casterPublicToken" data-theme="light" data-color="D4145A" data-channelId="" data-rendered="false"><a href="https://www.caster.fm">Radio Server Hosting</a></div><script src="https://cdn.cloud.caster.fm/widgets/embed.js"></script></body></html>''';

class ScheduleScreen extends StatelessWidget { const ScheduleScreen({super.key}); @override Widget build(BuildContext context)=>FutureBuilder<String>(future:_get(scheduleUrl),builder:(c,s){if(s.connectionState==ConnectionState.waiting)return const Center(child:CircularProgressIndicator()); if(s.hasError)return const _ErrorPage(title:'Grille indisponible',text:'La grille provisoire sera remplacée par le tableau officiel de Radio Ciwara.'); final data=jsonDecode(s.data!); final days=(data['days'] as List? ?? []); return ListView(padding:const EdgeInsets.all(18),children:[const Text('Grille des programmes',style:TextStyle(fontSize:28,fontWeight:FontWeight.w900)),const SizedBox(height:6),const Text('Source provisoire — sera remplacée par la grille officielle.',style:TextStyle(color:Colors.white70)),const SizedBox(height:18),...days.map((d)=>Card(child:ExpansionTile(title:Text(d['day']??''),children:[...(d['programs'] as List? ?? []).map((p)=>ListTile(leading:const Icon(Icons.access_time),title:Text(p['title']??''),subtitle:Text('${p['start']??''} – ${p['end']??''}')))]))) ]);}); }

class NewsScreen extends StatelessWidget { const NewsScreen({super.key}); @override Widget build(BuildContext context)=>FutureBuilder<String>(future:_get(newsUrl),builder:(c,s){if(s.connectionState==ConnectionState.waiting)return const Center(child:CircularProgressIndicator()); if(s.hasError)return const _ErrorPage(title:'Actualités indisponibles',text:'Réessayez lorsque la connexion est disponible.'); final data=jsonDecode(s.data!); final items=(data['items'] as List? ?? []); return RefreshIndicator(onRefresh:()=>_get(newsUrl),child:ListView(padding:const EdgeInsets.all(18),children:[const Text('Actualités',style:TextStyle(fontSize:28,fontWeight:FontWeight.w900)),const Text('Sources provisoires : Maliweb et Malijet',style:TextStyle(color:Colors.white70)),const SizedBox(height:16),...items.take(10).map((n)=>Card(child:ListTile(title:Text(n['title']??'',maxLines:3,overflow:TextOverflow.ellipsis),subtitle:Text(n['source']??''),trailing:const Icon(Icons.open_in_new))))]));}); }

class PodcastsScreen extends StatelessWidget { const PodcastsScreen({super.key}); @override Widget build(BuildContext context)=>const _Section(title:'Podcasts',subtitle:'Espace prêt pour les vrais podcasts et replays de Radio Ciwara.',cards:[('Dernières émissions',Icons.podcasts),('Réécouter',Icons.play_circle_outline),('Archives',Icons.library_music)]); }

class MoreScreen extends StatelessWidget { const MoreScreen({super.key}); @override Widget build(BuildContext context)=>ListView(padding:const EdgeInsets.all(18),children:[const Text('Radio Ciwara',style:TextStyle(fontSize:28,fontWeight:FontWeight.w900)),const Text('105.5 FM • Bamako, Mali',style:TextStyle(color:Colors.white70)),const SizedBox(height:18),_MenuTile(icon:Icons.live_tv,title:'Ciwara TV',text:'Vidéos et chaîne YouTube officielle',url:youtubeChannelUrl),_MenuTile(icon:Icons.article,title:'Ciwara Info',text:'Le journal Ciwara Info',url:'https://www.google.com/search?q=Ciwara+Info+Mali'),const _MenuTile(icon:Icons.favorite,title:'Contact',text:'Contactez Radio Ciwara'),const _MenuTile(icon:Icons.language,title:'Site Web',text:'Retrouvez Radio Ciwara en ligne')]); }

class _MenuTile extends StatelessWidget { final IconData icon; final String title,text; final String? url; const _MenuTile({required this.icon,required this.title,required this.text,this.url}); @override Widget build(BuildContext c)=>Card(child:ListTile(leading:Icon(icon),title:Text(title,style:const TextStyle(fontWeight:FontWeight.w800)),subtitle:Text(text),trailing:const Icon(Icons.arrow_forward_ios,size:15),onTap:()=>ScaffoldMessenger.of(c).showSnackBar(SnackBar(content:Text(url==null?'Section prête à être raccordée.':'Source : $url'))))); }

class _Section extends StatelessWidget { final String title,subtitle; final List<(String,IconData)> cards; const _Section({required this.title,required this.subtitle,required this.cards}); @override Widget build(BuildContext c)=>ListView(padding:const EdgeInsets.all(18),children:[Text(title,style:const TextStyle(fontSize:28,fontWeight:FontWeight.w900)),Text(subtitle,style:const TextStyle(color:Colors.white70)),const SizedBox(height:18),...cards.map((x)=>Card(child:ListTile(leading:Icon(x.$2),title:Text(x.$1),trailing:const Icon(Icons.arrow_forward_ios,size:15))))]); }
class _InfoCard extends StatelessWidget { final IconData icon; final String title,text; const _InfoCard({required this.icon,required this.title,required this.text}); @override Widget build(BuildContext c)=>Card(child:ListTile(leading:Icon(icon),title:Text(title,style:const TextStyle(fontWeight:FontWeight.w800)),subtitle:Text(text))); }
class _ErrorPage extends StatelessWidget { final String title,text; const _ErrorPage({required this.title,required this.text}); @override Widget build(BuildContext c)=>Center(child:Padding(padding:const EdgeInsets.all(24),child:Column(mainAxisSize:MainAxisSize.min,children:[const Icon(Icons.wifi_off,size:50),const SizedBox(height:12),Text(title,style:const TextStyle(fontSize:22,fontWeight:FontWeight.w800)),const SizedBox(height:8),Text(text,textAlign:TextAlign.center)]))); }
Future<String> _get(String url) async { final r=await http.get(Uri.parse(url)); if(r.statusCode!=200)throw Exception('HTTP ${r.statusCode}'); return r.body; }
