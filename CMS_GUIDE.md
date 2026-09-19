# NwiseIP 홈페이지 편집 안내

이 프로젝트는 10page와 관계없는 독립 정적 홈페이지입니다. 홈페이지 콘텐츠는 `dist/content`의 JSON 파일에 저장되고, Pages CMS가 이를 사람이 읽기 쉬운 입력 화면으로 보여줍니다.

## 편집 순서

1. `https://app.pagescms.org`에 GitHub 계정으로 로그인합니다.
2. `nwiseip/NW-hompage-2026` 저장소를 선택합니다.
3. 왼쪽 메뉴에서 언어별 콘텐츠, 연락처와 지도, 홈페이지 이미지를 선택합니다.
4. 내용을 수정하고 저장합니다.
5. 저장된 변경은 GitHub Actions를 통해 홈페이지에 자동 배포됩니다.

## 안전장치

- 모든 변경은 GitHub 기록으로 남아 이전 버전으로 복구할 수 있습니다.
- 전문가 고유 주소(slug)는 실수로 링크가 깨지지 않도록 읽기 전용입니다.
- 이미지 업로드 위치는 `dist/assets`로 제한되어 있습니다.
- 홈페이지 디자인 코드와 콘텐츠 파일을 분리했으므로 문구 수정이 레이아웃을 훼손하지 않습니다.

## 파일 구조

- `dist/content/ko.json`: 한국어 콘텐츠
- `dist/content/en.json`: 영어 콘텐츠
- `dist/content/ja.json`: 일본어 콘텐츠
- `dist/content/zh.json`: 중국어 콘텐츠
- `dist/content/es.json`: 스페인어 콘텐츠
- `dist/content/fr.json`: 프랑스어 콘텐츠
- `dist/content/contact.json`: 이메일, 전화, 팩스, 지도 링크
- `dist/content/media.json`: 로고, 대표 이미지, 전문가 사진
