import { KeyValue } from './KeyValue';

/**
 * 화면에 보여줄 알람 설정 항목들
 */
export class AlarmSettingOption {

  // 채용 분야
	detailCodeList: Array<KeyValue> = new Array();
	
	// 근무지
	locationList: Array<KeyValue> = new Array();
	
	// 고용 형태
	workTypeList: Array<KeyValue> = new Array();
	
	// 채용 구분
	careerList: Array<KeyValue> = new Array();
	
	// 대체 인력 유무 
	replacementList: Array<KeyValue> = new Array();
	
	// 기관명
	orgNameList: Array<KeyValue> = new Array();
    
}