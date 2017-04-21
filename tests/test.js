describe('api', function(){
    var APIService;
    
    beforeEach(function(){
        module('starter.APIservices');
        inject(function($injector){
            APIService = $injector.get('APIService');
        });
    });

    describe("APIservices", function(){
        describe("get_recipes_with_ingredients", function(){

            it("should return success", function(){
                var ingredients = ["apples", "flower", "sugar"];
                var response = APIService.get_recipes_with_ingredients(false, ingredients, false, 5, 1);
                expect(response.status).toEqual(200);
            });
        });
        describe("get_recipe_detail", function(){
            it("should return success", function(){
            });
        });
    });
});