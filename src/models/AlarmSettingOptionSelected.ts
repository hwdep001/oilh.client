/**
 * 선택된 알람 설정 Key값 저장
 */
export class AlarmSettingOptionSelected {

	isAlarm: boolean = false;

  // 채용 분야
	detailCodeList = [];
	
	// 근무지
	locationList = [];
	
	// 고용 형태
	workTypeList = [];
	
	// 채용 구분
	careerList = [];
	
	// 대체 인력 유무 
	replacement: string;
	
	// 기관명
	orgName: string;
    
}