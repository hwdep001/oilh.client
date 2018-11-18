import { KeyValue } from './KeyValue';

/**
 * 나의 알람 설정 정보(firestore)
 */
export class AlarmSettingInfo {

	uid: string;
	isAlarm: boolean = false;

  // 채용 분야
	detailCodeList: Array<KeyValue> = new Array();
	
	// 근무지
	locationList: Array<KeyValue> = new Array();
	
	// 고용 형태
	workTypeList: Array<KeyValue> = new Array();
	
	// 채용 구분
	careerList: Array<KeyValue> = new Array();
	
	// 대체 인력 유무 
	replacement: KeyValue = {key: "", value: "전체"};
	
	// 기관명
	orgName: KeyValue = {key: "", value: "전체"};
    
}