import 'package:flutter_test/flutter_test.dart';
import 'package:radio_ciwara_app/main.dart';

void main() {
  test('Radio Ciwara release configuration is wired', () {
    expect(siteBase, equals('https://ciwara-medias.ml'));
    expect(playerUrl, equals('$siteBase/radio-player.html'));
    expect(streamUrl, startsWith('https://'));
    expect(logoUrl, equals('$siteBase/assets/ciwara-logo-v2.svg'));
    expect(newsUrl, equals('$siteBase/data/news.json'));
    expect(scheduleUrl, equals('$siteBase/data/schedule.json'));
    expect(websiteUrl, equals('$siteBase/'));
  });
}
