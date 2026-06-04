/** 이미지 바이트 + 콘텐츠 타입. 레포지토리·프로세서·서비스가 공유하는 페이로드. */
export interface ImagePayload {
  data: Buffer;
  contentType: string;
}
