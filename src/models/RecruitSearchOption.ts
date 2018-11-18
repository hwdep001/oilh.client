export class RecruitSearchOption {

	// 페이지 번호
	pageNo: number = 1;
	
	//
	param: string = "";
	
	// key
	idx: string = "";
	
	// 등록 연도
	recruitYear: string = "";
	
	// 등록 월
	recruitMonth: string = "";
	
	// 채용 분야
	detailCode = [];
	
	// 근무지
	location = [];
	
	// 고용 형태
	workType = [];
	
	// 채용 구분
	career = [];
	
	// 대체 인력 유무 
	replacement: string;
	
	// 공고 시작 기간
	sDate: string = "";
	
	// 공고 종료 기간
	eDate: string = "";
	
	// 기관명
	orgName: string = "";
	
	// 상태 
	ing: string = "";
	
	// 제목
	title: string = "";
	
	// 정렬
	order: string = "REG_DATE";
    
}