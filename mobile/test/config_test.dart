import 'package:flutter_test/flutter_test.dart';
import 'package:radio_ciwara_app/main.dart';

void main() {
  test('Radio Ciwara release configuration is wired', () {
    expect(casterPublicToken, isNotEmpty);
    expect(siteBase, contains('Radio-Ciwara-'));
    expect(newsUrl, endsWith('/data/news.json'));
    expect(scheduleUrl, endsWith('/data/schedule.json'));
  });
}
