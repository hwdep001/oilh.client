import { KeyValue } from './KeyValue';

/**
 * 화면에 보여줄 알람 설정 항목들 -> map
 */
export class AlarmSettingOptionMap {

  // 채용 분야
	detailCodeMap: Map<string, KeyValue> = new Map();
	
	// 근무지
	locationMap: Map<string, KeyValue> = new Map();
	
	// 고용 형태
	workTypeMap: Map<string, KeyValue> = new Map();
	
	// 채용 구분
	careerMap: Map<string, KeyValue> = new Map();
	
	// 대체 인력 유무 
	replacementMap: Map<string, KeyValue> = new Map();
	
	// 기관명
	orgNameMap: Map<string, KeyValue> = new Map();
    
}